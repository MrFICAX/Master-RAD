from enum import Enum
import open_clip
import torch

class OPEN_CLIP_MODEL(Enum):
    xlm_roberta_base_ViT_B = "xlm-roberta-base-ViT-B-32"
    xlm_roberta_large_ViT_H = 'xlm-roberta-large-ViT-H-14'

models = {
    'xlm-roberta-base-ViT-B-32': {
        'model_name': "xlm-roberta-base-ViT-B-32",
        'pretrained': "laion5B-s13B-b90k",
        'embedding_size': 512
    },

    'xlm-roberta-large-ViT-H-14': {
        'model_name': "xlm-roberta-large-ViT-H-14",
        'pretrained': "frozen_laion5b_s13b_b90k",
        'embedding_size': 1024
    }
}

def get_open_clip_model(OPEN_CLIP_MODEL: str):

    model_name = models[OPEN_CLIP_MODEL]['model_name']
    pretrained = models[OPEN_CLIP_MODEL]['pretrained']
    embedding_size = models[OPEN_CLIP_MODEL]['embedding_size']

    tokenizer = open_clip.get_tokenizer(OPEN_CLIP_MODEL)

    model, _, preprocess = open_clip.create_model_and_transforms(model_name, pretrained=pretrained)
    model.to(device=get_device())
    return model, preprocess, tokenizer, model_name, pretrained, embedding_size

def get_model_name(OPEN_CLIP_MODEL: str):
    model_name = models[OPEN_CLIP_MODEL]['model_name']
    return model_name

def get_device() -> torch.device:
    # # check if we have cuda installed
    if torch.cuda.is_available():
        # to use GPU
        device = torch.device("cuda")
        print('There are %d GPU(s) available.' % torch.cuda.device_count())
        print('GPU is:', torch.cuda.get_device_name(0))
    else:
        print('No GPU available, using the CPU instead.')
        device = torch.device("cpu")
    return device