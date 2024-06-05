import PIL
from torch.utils.data import Dataset

class Images_with_Index(Dataset):

    def __init__(self, cache: dict, transform):
        self.images_dict = cache
        self.transform = transform

    def __len__(self):
        return len(self.images_dict)

    def __getitem__(self, idx):
        image_path = self.images_dict[list(self.images_dict.keys())[idx]]['image_path']
        index = list(self.images_dict.keys())[idx]

        image = PIL.Image.open(image_path)
        image = self.transform(image)

        data = {
            'index': index,
            'image': image #,
        }
        return data
