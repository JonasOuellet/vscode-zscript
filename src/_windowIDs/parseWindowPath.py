import json
import os

set_to_null = True
output_file = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir,
                              os.pardir, 'zsc_lang', 'zWindowIDs.json'))

with open('interfacePaths.TXT', mode='r') as f:
    windowid = {}

    for l in f.readlines():
        l = l.strip()
        
        if l.isalnum():
           continue

        splitted = l.split(':')

        data = windowid
        for x, split in enumerate(splitted):
            if not set_to_null:
                # Set to empty object:
                nd = data.get(split, {})
            else:
                # Set to null
                if x >= len(splitted) - 1:
                    nd = data.get(split, None)
                else:
                    nd = data.get(split, {})
                    if nd is None:
                        nd = {}

            data[split] = nd
            data = nd

    with open(output_file, mode='w') as fw:
        json.dump(windowid, fw, indent=4)



