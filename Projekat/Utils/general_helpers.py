import os
import yaml


def load_yaml_settings():
    ROOT_DIR: str = get_root_dir()
    yaml_filepath = os.path.join(ROOT_DIR, 'paths.yaml')

    with open(yaml_filepath, 'r') as file:
        yaml_data = yaml.safe_load(file)

    return yaml_data

def get_root_dir() -> str:
    ROOT_DIR = os.path.split(os.environ['VIRTUAL_ENV'])[0]
    return ROOT_DIR