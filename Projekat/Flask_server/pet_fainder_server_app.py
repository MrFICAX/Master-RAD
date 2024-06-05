from flask import Flask, request, jsonify
import os
from pymilvus import MilvusClient, connections, Collection
import sys
import numpy as np
from PIL import Image
import boto3 
import json
from datetime import datetime
import torch
import mimetypes
from math import cos
from Utils.model_helpers import get_open_clip_model_and_device, OPEN_CLIP_MODEL

ROOT_DIR = os.path.split(os.environ['VIRTUAL_ENV'])[0]
if ROOT_DIR not in sys.path:
  sys.path.append(ROOT_DIR)

app = Flask(__name__)

# Set up a Milvus client
client = MilvusClient(
    uri="http://localhost:19530"
)

connections.connect(
  alias="default", 
  host='localhost', 
  port='19530'
)
COLLECTION_NAME = "pet_visual_only_collection"
collection = Collection(COLLECTION_NAME)
schema = collection.schema
field_names = [field.name for field in schema.fields]

with open('Flask_server/aws-config2.json', 'r') as f:
    aws_config_data = json.load(f)

ACCESS_KEY = aws_config_data['accessKeyId']
SECRET_KEY = aws_config_data['secretAccessKey']
REGION = aws_config_data['region']
BUCKET_NAME = aws_config_data['bucketName']

# AWS S3 Configuration
s3 = boto3.resource('s3', aws_access_key_id=ACCESS_KEY,
                aws_secret_access_key=SECRET_KEY, region_name=REGION)

model_data = get_open_clip_model_and_device(OPEN_CLIP_MODEL.xlm_roberta_large_ViT_H.value)

model, preprocess, tokenizer, model_name, pretrained, embedding_size, device = model_data

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

top_number = 15
top_number_hybrid_search = 150

def get_union_of_results(pet_datalist_from_text_search, pet_datalist_from_visual_search):

    map2 = {item['id']: item for item in pet_datalist_from_text_search}

    # Lists to store elements present in both lists and only in one list
    in_both_lists = []
    in_one_list = {item['id']: item for item in pet_datalist_from_text_search}

    for item in pet_datalist_from_visual_search:
        if item['id'] in map2:
            new_item = item.copy()
            new_item['distance'] = new_item['distance'] +  map2[item["id"]]['distance']
            in_both_lists.append(new_item)
            in_one_list.pop(item['id'], None)
        else:
            in_one_list[item['id']] = item

    # Convert the dictionary to a list and sort it by the specified key
    sorted_in_one_list = sorted(in_one_list.values(), key=lambda x: x['distance'], reverse=True)

    # sorted_in_both_lists = sorted(in_both_lists.values(), key=lambda x: x['distance'], reverse=True)
    sorted_in_both_lists = sorted(in_both_lists, key=lambda x: x['distance'], reverse=True)

    # Combine the two lists
    result = sorted_in_both_lists + sorted_in_one_list
    return result

def delete_image_from_s3(image_key):
    """
    Delete an image from an S3 bucket.
    :param image_key: The key of the image to delete.
    :return: Tuple indicating success (True/False) and the response or error message.
    """
    try:
        # response = s3.delete_object(Bucket=BUCKET_NAME, Key=image_key)
        response = s3.Object(BUCKET_NAME, image_key).delete()


        if response['ResponseMetadata']['HTTPStatusCode'] == 204:
            return (True, "Image deleted successfully.")
        else:
            return (False, "Failed to delete the image. Response: {}".format(response))

    except Exception as e:
        return (False, str(e))


def upload_image_to_s3(storage_image):

    try:
        BUCKET = BUCKET_NAME

        IMAGE_KEY = 'uploaded_image_' + datetime.utcnow().strftime('%Y%m%d%H%M%SZ')

        bucket = s3.Bucket(BUCKET)
        extension = mimetypes.guess_extension( storage_image.headers['content-type'])
        full_image_name = IMAGE_KEY + extension

        response = bucket.Object(full_image_name).put(Body=storage_image.read(), ACL='public-read')

        if response['ResponseMetadata']['HTTPStatusCode'] == 200:        
            return (True, full_image_name)
        else:
            raise Exception(response)

    except Exception as e:
        print("Failed to upload the file:", e)
        return (False, None)


@app.route('/getdata', methods=['POST'])
def getdata():
    # data = request.get_json()
    try:
        data = request.get_json()
        top_number = data['top_number']
        is_found = data['is_found']
        is_missing = data['is_missing']
        SHOULD_BE_NORMALISED = data['SHOULD_BE_NORMALISED']
        latitude = data['latitude']
        longitude = data['longitude']
        radius = int(data['radius'])
        
        min_lat, max_lat, min_lon, max_lon = min_max_lat_lon(latitude, longitude, radius)
        
        search_embedding = model.encode_text(tokenizer("").to(device)).cpu().detach().numpy()
        print(top_number)
        
        if SHOULD_BE_NORMALISED == "norm":
            search_embedding = search_embedding / np.linalg.norm(search_embedding, ord=2, axis=-1, keepdims=True)

        print(search_embedding)
        
        pet_results = client.search(
            collection_name=COLLECTION_NAME,
            data = search_embedding,
            limit = top_number, # Max. number of search results to return
            output_fields = [field for field in field_names if field not in ['pet_visual_vector']],
            filter=f'is_missing == {is_missing} and is_found == {is_found} and ({min_lat} < pet_latitude < {max_lat}) and ({min_lon} < pet_longitude < {max_lon})'

            #search_params={"metric_type": "IP", "params": {}} # Search parameters
        )
        pet_results = pet_results[0]
        print(pet_results)
        return jsonify({'message': 'Returning pet data!', 'pet_results': pet_results}), 200
    except Exception as e:
        # Handle any other exceptions
        return jsonify({'error': str(e)}), 500


@app.route('/searchtext', methods=['POST'])
def searchtext():
    try:
        data = request.get_json()
        
        top_number = data['top_number']
        is_found = data['is_found']
        is_missing = data['is_missing']
        latitude = data['latitude']
        longitude = data['longitude']
        radius = int(data['radius'])
        
        min_lat, max_lat, min_lon, max_lon = min_max_lat_lon(latitude, longitude, radius)
        
        search_term = data['text']
        SHOULD_BE_NORMALISED = data['SHOULD_BE_NORMALISED']
        search_embedding = model.encode_text(tokenizer(search_term).to(device)).cpu().detach().numpy()

        if SHOULD_BE_NORMALISED == "norm":
            search_embedding = search_embedding / np.linalg.norm(search_embedding, ord=2, axis=-1, keepdims=True)

        pet_results = client.search(
            collection_name=COLLECTION_NAME, 
            data = search_embedding,
            limit = top_number, # Max. number of search results to return
            output_fields = [field for field in field_names if field not in ['pet_id', 'pet_visual_vector']],
            filter=f'is_missing == {is_missing} and is_found == {is_found} and ({min_lat} < pet_latitude < {max_lat}) and ({min_lon} < pet_longitude < {max_lon})'

            # filter=f'is_missing == {is_missing} and is_found == {is_found}'
        )
        pet_results = pet_results[0]
        return jsonify({'message': 'Search by text successful!', 'data': data, 'pet_results': pet_results}), 200
    except Exception as e:
        # Handle any other exceptions
        return jsonify({'error': str(e)}), 500


@app.route('/searchimage_pet', methods=['POST'])
def search_by_image_pet():
    try:
        files = request.files
        storage_image = files.get('image')

        pil_img = Image.open(storage_image)  # load with Pillow
        X = preprocess(pil_img).unsqueeze(0).to(device)
        search_embedding = model.encode_image(X).cpu().detach().numpy()
        print(search_embedding)

        pet_data = request.form
        is_found = True if pet_data.get('is_found') == "true" else False
        is_missing = True if pet_data.get('is_missing') == "true" else False
        latitude = float(pet_data.get('latitude'))
        longitude = float(pet_data.get('longitude'))
        radius = int(pet_data.get('radius'))
        
        min_lat, max_lat, min_lon, max_lon = min_max_lat_lon(latitude, longitude, radius)
        
        pet_results = client.search(
            collection_name=COLLECTION_NAME, 
            data = search_embedding,
            limit = top_number, # Max. number of search results to return
            output_fields = [field for field in field_names if field not in ['pet_id', 'pet_visual_vector']],
            filter=f'is_missing == {is_missing} and is_found == {is_found} and ({min_lat} < pet_latitude < {max_lat}) and ({min_lon} < pet_longitude < {max_lon})'
        )
        pet_results = pet_results[0]
        return jsonify({'message': 'Search by image successful!', 'pet_results': pet_results}), 200   
    except Exception as e:
        # Handle any other exceptions
        return jsonify({'error': str(e)}), 500


@app.route('/hybrid_search_pet', methods=['POST'])
def hybrid_search_pet():
    try:
        files = request.files
        storage_image = files.get('image')

        pil_img = Image.open(storage_image)  # load with Pillow
        X = preprocess(pil_img).unsqueeze(0).to(device)
        search_embedding_image = model.encode_image(X).cpu().detach().numpy()
        print(search_embedding_image)

        pet_data = request.form
        is_found = True if pet_data.get('is_found') == "true" else False
        is_missing = True if pet_data.get('is_missing') == "true" else False
        latitude = float(pet_data.get('latitude'))
        longitude = float(pet_data.get('longitude'))
        radius = int(pet_data.get('radius'))
        
        min_lat, max_lat, min_lon, max_lon = min_max_lat_lon(latitude, longitude, radius)
        
        
        search_term = pet_data['text']
        SHOULD_BE_NORMALISED = pet_data['SHOULD_BE_NORMALISED']
        search_embedding_text = model.encode_text(tokenizer(search_term).to(device)).cpu().detach().numpy()

        if SHOULD_BE_NORMALISED == "norm":
            search_embedding_text = search_embedding_text / np.linalg.norm(search_embedding_text, ord=2, axis=-1, keepdims=True)

        pet_results_texts = client.search(
            collection_name=COLLECTION_NAME, 
            data = search_embedding_text,
            limit = top_number_hybrid_search, # Max. number of search results to return
            output_fields = [field for field in field_names if field not in ['pet_id', 'pet_visual_vector']],
            filter=f'is_missing == {is_missing} and is_found == {is_found} and ({min_lat} < pet_latitude < {max_lat}) and ({min_lon} < pet_longitude < {max_lon})'
        )
        pet_results_texts = pet_results_texts[0]
        
        #SEARCH USING IMAGE
        pet_results_images = client.search(
            collection_name=COLLECTION_NAME, 
            data = search_embedding_image,
            limit = top_number_hybrid_search, # Max. number of search results to return
            output_fields = [field for field in field_names if field not in ['pet_id', 'pet_visual_vector']],
            filter=f'is_missing == {is_missing} and is_found == {is_found} and ({min_lat} < pet_latitude < {max_lat}) and ({min_lon} < pet_longitude < {max_lon})'
        )
        pet_results_images = pet_results_images[0]
        # pet_results_images.pop('id', None)
        
        pet_results_images = get_union_of_results(pet_results_texts, pet_results_images)
            
        pet_results_images = pet_results_images[:top_number]

        return jsonify({'message': 'Search by image successful!', 'pet_results': pet_results_images}), 200   
    except Exception as e:
        # Handle any other exceptions
        return jsonify({'error': str(e)}), 500


@app.route('/add_new_pet', methods=['POST'])
def add_new_pet():

    try:
        files = request.files
        storage_image = files.get('image')

        s3_upload_result, filename = upload_image_to_s3(storage_image)

        if not s3_upload_result:
            return jsonify({'message': 'Image not uploaded to S3'}), 400

        pet_data = request.form
        name = pet_data.get('name')
        contact = pet_data.get('contact')
        latitude = float(pet_data.get('latitude'))
        longitude = float(pet_data.get('longitude'))
        is_found = True if pet_data.get('is_found') == "true" else False
        is_missing = True if pet_data.get('is_missing') == "true" else False
        radius = 5000
        
        min_lat, max_lat, min_lon, max_lon = min_max_lat_lon(latitude, longitude, radius)
        
        pil_img = Image.open(storage_image)  # load with Pillow
        X = preprocess(pil_img).unsqueeze(0).to(device)
        image_embedding = model.encode_image(X)
        search_embedding = image_embedding.cpu().detach().numpy()

        final_embedding = torch.Tensor(image_embedding.squeeze())

        new_pet_data = {
            #"pet_id": max_id,
            "pet_image_filename": filename,
            "pet_finder_name": name,
            "pet_finder_contact": contact,
            "pet_latitude": latitude,
            "pet_longitude":longitude,
            "is_found": is_found,
            "is_missing": is_missing,
            "pet_visual_vector": final_embedding 
        }
        res = client.insert(
            collection_name=COLLECTION_NAME,
            data=[new_pet_data]
        )
        if res['insert_count'] != 1:
            success, message = delete_image_from_s3(filename)
            if success:
                print(message)
            else:
                print("Error:", message)
            return jsonify({'message': 'Image not uploaded to S3'}), 400
        pet_results = client.search(
            collection_name=COLLECTION_NAME, 
            data = search_embedding,
            limit = top_number,
            output_fields = [field for field in field_names if field not in ['pet_visual_vector']],
            filter=f'is_missing == {is_missing} and is_found == {is_found} and ({min_lat} < pet_latitude < {max_lat}) and ({min_lon} < pet_longitude < {max_lon})'
        )
        
        pet_results = pet_results[0]
        return jsonify({'message': 'Pet successfully added!', 'pet_results': pet_results}), 200   
    except Exception as e:
        # Handle any other exceptions
        return jsonify({'error': str(e)}), 500


@app.route('/search_by_location', methods=['POST'])
def search_by_location():

    try:
        data = request.get_json()
        
        latitude = data['latitude']
        longitude = data['longitude']
        pet_description = data['pet_description']
        radius = int(data['radius'])
        min_lat, max_lat, min_lon, max_lon = min_max_lat_lon(latitude, longitude, radius)
        
        search_embedding = model.encode_text(tokenizer(pet_description).to(device)).cpu().detach().numpy()
        print(top_number)
        
        pet_results = client.search(
            collection_name=COLLECTION_NAME, 
            data = search_embedding,
            limit = top_number,
            output_fields = [field for field in field_names if field not in ['pet_visual_vector']],
            filter=f'({min_lat} < pet_latitude < {max_lat}) and ({min_lon} < pet_longitude < {max_lon})'
        )
        
        pet_results = pet_results[0]

        return jsonify({'message': 'Pet successfully added!', 'pet_results': pet_results}), 200   
    except Exception as e:
        # Handle any other exceptions
        return jsonify({'error': str(e)}), 500


def min_max_lat_lon(query_lat, query_lon, distance):
    # Radius of the Earth in meters
    earth_radius = 6371 * 1000  # in meters
    
    # Convert distance from meters to radians
    distance_rad = distance / earth_radius
    
    # Calculate latitude range
    lat_delta = distance_rad * (180 / 3.141592653589793)  # Convert radians to degrees
    min_lat = query_lat - lat_delta
    max_lat = query_lat + lat_delta
    
    # Calculate longitude range
    lon_delta = distance_rad * (180 / 3.141592653589793) / cos(query_lat * (3.141592653589793 / 180))  # Convert radians to degrees
    min_lon = query_lon - lon_delta
    max_lon = query_lon + lon_delta
    
    return min_lat, max_lat, min_lon, max_lon

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')