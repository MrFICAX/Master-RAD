import os

def get_root_dir() -> str:
    ROOT_DIR = os.path.split(os.environ['VIRTUAL_ENV'])[0]
    return ROOT_DIR

def check_file_exist(file_name):
    file_path = os.path.join(os.getcwd(), file_name)
    file_exists = os.path.isfile(file_path)
    status = "exists" if file_exists else "does not exist"
    print(f"The file '{file_name}' {status} in the current folder.")
    return file_exists
