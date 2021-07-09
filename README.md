# Dashboard

Dashboard connects authenticated campus users with LibGuides data pertaining to their course and department affiliations. The Dashboard was developed by the Miami University Libraries in Ohio. Much of the code is specific to Miami's own situation; developers are welcome to fork the repo to develop it for their own uses.

## Requirements

- Node.js
- CAS (Central Authentication Service) -- though you could undoubtedly repurpose much of the code for a different authentication service that also shares user's subject affiliation data
- LibGuides (subscription required)
- A fair amount of local customization -- this project is designed to work with the data structures in place at Miami University; you would undoubtedly need to modify it for your own situation

### Additional (optional) ILS integration

- III Sierra

## Initial (Test) Setup

To use this repo as-is, with fake/modified data from Miami University's initial instance, do this on the command line:

### fetch dependencies

1. `npm update`

### setup environment

2. `touch .env`
3. edit the .env file to include a version of this text `ALLOWED_USERS=‘yourusername,root'` (include the names of the users who should be permitted to start the app from the command line; this is more important in a server environment)

### copy sample files to their locations

4. `cp samples/cache/* cache/`
5. `cp config/default-sample.json config/default.json`
6. `cp samples/fakeusers/* fakeUsers/`
7. `cp config/fakeUser-sample.json config/fakeUser.json`

### generate cached subject files

8. `./compileSubjectCache.sh (ignore “no such file” warning)`

### start the app

9. `./restart` -- the app should be running on localhost:9999, and logging errors to `logs/app.log`

## Full Setup

To use the app with your own data, you'll need to do some additional setup, and have appropriate API keys for your LibGuides instance.

- run `npm update` to install dependencies
- create a `.env` file in the top level directory of the app
- copy `config/default-sample.json` to `config/default.json` and add your organization's CAS server details and secret key
- add the LibGuides API v 1.1 KEY and SITE_ID to the `.env` file (see below)
- using `cron` or similar, run the `./getData.sh` periodically; this will:
  - create needed cache and cache/subjects directories
  - update data from LibGuides
  - update subject caches from LibGuides data
- for best results, run the app using `./restart`, which will run some checks for missing data in advance of running the app. (To skip these checks, run the app using `node app` (on localhost), or `npm run server` to run on the server.)
- defaults to running on port 3000; to use another port, define PORT in `.env`
- stop the app on the server using `./killapp`
  - to stop the app and restart it immediately, use `./killapp -r` or `./restart`

## How the Parts Connect

- `./getData.sh` pulls JSON lists of Subjects, Databases, Librarians, & Guides from LibGuides and stores them in the `./cache/` folder
  - after `./getData.sh` retrieves the Librarians info, it's written to `./cache/LibrariansTemp.js`, the `./getData.sh` script goes on to process the content with `utilities/runCleanCache.js`, which cleans up the "mysched" scheduling block widget code, adding a standard class and applying standardized CSS to eliminate visual variation between librarians.
  - after pulling updates, getData runs `compileSubjectCache` (see below)
  - then runs `utilities/compareLGSubjects` and reports on any changes since the last update. If there are changes, they may need to be reflected in the Majors.js file manually (e.g. if a Subject guide changes name)
- `./models/Majors.js` is a manually-compiled list of majors and course subjects, including registrar's department codes and program codes, the human-readable department name, and the names of the associated LibGuide Subjects. (LibGuide Subjects are the broader categories; each subject may have zero or more linked Guides -- Majors.js knows about the Subjects, not the Guides.)
- `node compileSubjectCache.js` reads the cached LibGuides data and the Majors array to synthesize the relevant data for each subject area: for each subject in the Majors array, it creates a file in `./cache/subjects/` that lists all of the Guides, Databases, and Librarians associated with the LibGuides Subjects identified in Majors.js. The subject cache will include duplicate files for variant versions of a subject name, e.g. `WomensGenderandSexualityStudies.json` and `WomensGenderSexualityStudies.json`

## Auditing coverage

- run `node coverageReport.js` to generate `cache/subjects/coverageReport.csv` listing number of librarians, guides, and databases per subject

## Sample `.env` file:

```
PORT=4000
SITE_ID=007
KEY=asdfasdfasdfasdfasdfasdfasd
ALLOWED_USERS='root,someuser'
```

- PORT : the port the app will run on
- SITE_ID : the libguides site id for your institutions LibGuides
- KEY : LibGuides API Key
- ALLOWED_USERS : comma-separated single string of users with permissions to start/restart the service. If you require sudo to restart the service, then this might just be 'root' (this may be the case in production). For development, you may allow other users so the process may be run other than as root. The killapp/restart scripts only run if the user is allowed. Why do this? Otherwise it would be easy to think you've restarted the service when your really haven't.

## Running the service

- run using `npm run server`: adds `--name=Dashboard` for easy finding
- kill using `./killapp`: searches processes for `dashboard` and kills that proc
- kill and restart with `./killapp -r`

## Routes

The service offers two routes:
`/` - the normal html view
`/json` - view the userinfo tree as json (useful for while we're building views -- this should probably be removed in production
)

## Running tests

- run mocha/chai tests using `npm test`

## Fake User Accounts

- there are several fake users in `./samples/` -- these JSON files contain simulated CAS data for a variety of users
- fake users are listed in the `./config/fakeUser-sample.json` file
- when running on localhost (i.e. not on the production server with CAS integration), you can use a fakeUser to simulate various users. to do so, copy the sample file above to `./config/fakeUser.json`; in that file, set `"useFakeUser": false` and select the "fakeUserId" you wish to simulate; IDs start from 0, referencing the "fakeUsers" array.

## Custom Data

If you have a subject area for which there is no LibGuides subject, you can fake it! (We use this is our library for members of the library -- we link to some internal LibGuides that don't have their own public-facing "department"). Manually build a subject file in `./cache/custom`, e.g. `./cache/custom/Library.json`. The `./compileSubjectCache` script will copy it over to the `./cache/subjects` directory after compiling the other subject guides.

## Data Structure

### models/subjCodes.js

```
{
    name: 'Music',
    majorCode: 'ASJA',
    majorName: 'Music',
    majorCode2: 'FAJA',
    majorName2: 'Music',
    regCode: 'MUS',
    regName: 'Music',
    deptCode: 'mus',
    deptName: 'Music',
    libguides: ['Music'],
  },
```

- "name": this field will be used to generate a file in `./cache/subject/` named `Journalism.json`
- the xxxCode fields map the dept, major, and reg(istrar) Codes for this subject to the related libguides subjects
- the contents of `Journalism.json` will be based on the librarians, databases, and guides associated with the `Music` LibGuide Subject in the `./cache/Subjects.js` file:

```
{
      "id" : "8429",
      "ordering" : "0",
      "site_id" : "594",
      "slug" : null,
      "name" : "Music"
}
```

### Subjects.js

In turn, the LibGuides subject ID defined above (`8429`) will include in the `./cache/subjects/Music.json` file all the Librarians, Databases, and Guides that are associated with `id: 8429` in `./cache/Librarians.js`, `./cache/Database.js`, and `./cache/Guides.js` files

### `utilities/getSubjCodes.sh`

Periodically, run the `utilities/getSubjCodes.sh` file to fetch any new or changed subject codes from campus APIs. Then run `node utilities/checkSubjectCodes` to audit the updated information against the existing `models/subjCodes` file and check for any discrepancies.

### Miami departments list including non-academic depts:

https://community.miamioh.edu/directory-accounts/api/prefixDetails?type=dpt

## Credits

The Dashboard was developed by Ken Irwin at the Miami University Libraries with UI support from Meng Qu.
