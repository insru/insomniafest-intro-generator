# insomniafest-intro-generator

## Before run

```bash
# install nodejs (mac)
$ brew install node
```

## Prepare data
- Fill data in data/videos.csv
```bash
# Run CSV to JSON converter
$ node helpers/csvToJsonConverter.js
```
- Check and edit generated data in data/videos.json

## Run script in AE
- Open intro.aep
- File -> Scripts -> Run script file
- Run generation-script.jsx
- Wait till AE done
- Review compositions in renderComps folder
- Render and relax :)
