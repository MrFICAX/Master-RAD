# MASTER RAD - VECTOR SEARCH

## This is project for Master thesis with name "Search of multi-modal vectorized data" at The University of Nis, Faculty of Electronic Engineering

Vector and semantic search is a field of study of vector spaces where all unstructured data is projected into the same latent space. Encoders of multimodal models are trained on data pairs of different modalities such as image-text pairs where each text represents a description of the image. Vector and semantic search are use cases where vector representations of datasets are stored in vector database indexes or index files. In this way, vector and semantic similarity search is used for search cases where we can search the image database using only an image or image description and get the most similar results.
The main goal of this work is to design a prototype of an application that searches for vectorized data of images of lost or found pets. Users who have lost their pets can upload pictures of pets and search the vector database, while user-finders can upload pictures of found pets. After adding a new pet or search, the results obtained are used to connect two users just by searching the lost pet image database.
Keywords: vector search, visual and semantic search, vector databases, multi-modal models, vector indexes.


The main purpose of this project is search of image dataset just by image or image visual description.

To start project:
1. Download dataset from: https://www.kaggle.com/datasets/tunguz/cats-and-dogs-embedded-data?select=test
1. Create python venv and install all dependencies.
    - pip install open-clip-torch joblib transformers annoy ipykernel streamlit pymilvus pydeck

2. Create Milvus Database on Docker containers using docker-compose up -d from the Code/Vector_Database/Milvus folder.
3. Create Database collection, schema and artificial dataset using database_superadmin.ipynb from Code/Vector_Database/Milvus folder.
4. Start Flask server with AWS credentials (currently they are private) and Milvus credentials from Code/Flask_server using .vscode/launch.json 
5. Start React frontend App
 - Locate in terminal in React Frontend/pet-fainder-app:
    npm start





------------------------------------------------------------------

pip install --upgrade streamlit pydeck


Starting venv in console on Windows:
    .venv/Scripts/activate.ps1

Docker:
    Creating Docker container with Flask server:
        docker build -t flask-server-pet-fainder .

    List docker images:
        docker images

    Start container:
        docker run --name FlaskServer-PetFainder p -p 5000:5000 -d flask-server-pet-fainder

    Start milvus:
        docker compose up -d

   Start Attu:
        docker run -p 8000:3000 --network milvus --name attu -e MILVUS_URL=192.168.0.1:19530 zilliz/attu:v2.3.10


<!-- Streamlit:
    Starting code:
        streamlit run .\streamlit_img-x-txt_latest_catalog.py -->


Dataset link: https://www.kaggle.com/datasets/tunguz/cats-and-dogs-embedded-data?select=test