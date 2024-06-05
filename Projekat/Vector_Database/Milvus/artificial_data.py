
import numpy as np
import random
import pandas as pd

pet_finder_names = ["Ana Ivanović", "Marko Petrović", "Jovana Janković", "Stefan Nikolić", "Milica Stojanović", "Nikola Pavlović", "Tamara Đorđević", "Vuk Stojković", "Sofija Kovačević", "Luka Stojanović", "Ana Nikolić", "Petar Janković", "Jovana Stojković", "Marko Kovačević", "Jovana Petrović", "Nikola Janković", "Stefan Đorđević", "Milica Petrović", "Tamara Stojanović", "Vuk Nikolić", "Sofija Đorđević", "Luka Janković", "Jovana Kovačević", "Stefan Stojanović", "Milica Đorđević", "Nikola Kovačević", "Tamara Nikolić", "Vuk Janković", "Ana Đorđević", "Petar Petrović", "Jovana Nikolić", "Marko Stojanović", "Jovana Đorđević", "Stefan Petrović", "Milica Janković", "Tamara Petrović", "Vuk Đorđević", "Sofija Nikolić", "Luka Đorđević", "Ana Kovačević", "Petar Stojanović", "Jovana Stojanović", "Marko Đorđević", "Jovana Petrović", "Nikola Đorđević", "Stefan Janković", "Milica Kovačević", "Tamara Đorđević", "Vuk Petrović", "Sofija Janković", "Luka Petrović", "Ana Đorđević", "Petar Janković", "Jovana Kovačević", "Marko Đorđević", "Jovana Stojanović", "Nikola Petrović", "Stefan Janković", "Milica Nikolić", "Tamara Đorđević", "Vuk Petrović", "Sofija Stojanović", "Luka Janković", "Ana Đorđević", "Petar Petrović", "Jovana Nikolić", "Marko Đorđević", "Jovana Petrović", "Nikola Đorđević", "Stefan Janković", "Milica Kovačević", "Tamara Đorđević", "Vuk Petrović", "Sofija Janković", "Luka Petrović", "Ana Đorđević", "Petar Janković", "Jovana Kovačević", "Marko Đorđević", "Jovana Stojanović"]

def generate_location_data(n_rows=1000):
    citys = [[43.538, 21.706], [43.322, 21.895], [44.795, 20.464]]
    # Generate random data for latitude and longitude
    random_data = np.random.randn(n_rows, 2) / [50, 50]

    # Randomly select n_rows coordinates from the list 'citys'
    selected_coords = [random.choice(citys) for _ in range(n_rows)]

    # Convert selected coordinates to numpy array and reshape it
    selected_coords = np.array(selected_coords).reshape(-1, 2)

    # Add random data to selected coordinates
    result = random_data + selected_coords


    chart_data = pd.DataFrame(
    result,
    columns=['lat', 'lon'])

    copy_chart_data = chart_data.copy()
    rounded_chart_data = copy_chart_data.round(3)
    # new_row = {'lat':  43.537568, 'lon': 21.711677}
    # chart_data.loc[len(chart_data)] = new_row
    return rounded_chart_data


def generate_missing_found_data(n_rows):

    boolean_pairs = []
    for _ in range(n_rows):
        flag = random.choice([True, False])
        pair = (flag, not flag)
        boolean_pairs.append(pair)
    return boolean_pairs
