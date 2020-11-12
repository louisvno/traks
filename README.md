# Traks

Static blog to show cycling and hiking routes that I've done by plotting gpx data on openstreet maps using the Leaflet.js library. Also includes a script to process and optimize the raw gpx data. If you know a bit about Angular you can easily fork this project and add your own gpx data to generate your own blog.

## Adding new tracks

1. Use "npm run new-track" to create a folder and metadata file.

2. add the gpx file to a new folder in \data\tracks\\"new folder"

3. run "npm run convert" to convert the track to json and optimize it. The result is added in \src\assets\tracks folder

4. add the trackname to the file \src\assets\tracks\tracklist.json. Tracks in this list will be published in the app. 


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
