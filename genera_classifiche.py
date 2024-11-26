import json
import random

# Function to generate placeholder data for an array of objects
def generate_placeholder_data(num_entries):
    return [
        {
            "Rank": i + 1,
            "Giocatore": f"Giocatore_{i + 1}",
            "Statistica": random.randint(1, 100)
        }
        for i in range(num_entries)
    ]

# Create the JSON structure
json_data = {
    "sfida": {
        "partite vinte": generate_placeholder_data(200),
        "partite giocate": generate_placeholder_data(200),
        "classi testate": generate_placeholder_data(200)
    },
    "scalata": {
        "statistica1": generate_placeholder_data(150),
        "statistica2": generate_placeholder_data(150)
    }
}

# Save the JSON to a file
output_path = "C:/Users/Andrea/Desktop/prova frontend classifica/classifiche.json"

with open(output_path, "w") as file:
    json.dump(json_data, file, indent=4)