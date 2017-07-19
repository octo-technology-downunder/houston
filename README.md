# Description

Use voice control to trigger a deployment secured by a confirmation code sent to a screen collocalized with the voice controller.

# Details

- Voice control using Alexa
- Logic layer using Lambda
- Deployment using Jenkins job
- Confirmation code sent on a API exposed by a node.js server running on local network Raspberry Pi
- Confirmation code displayed by the raspberry pi on a LCD display screen

# Setup

- Power up a raspberry pi, and have it connected to a 16x2 LCD screen, using the following pins:
-- pin 27 to LCD RS
-- pin 22 to LCD clock enable
-- pin 25 to LCD data line 4
-- pin 24 to LCD data line 5
-- pin 23 to LCD data line 6
-- pin 18 to LCD data line 7
-- pin 4 to LCD backlight
- Add the [lcd_display_server](lcd_display_server) folder to your raspberry
- ssh to your raspberry and start the server
```
cd lcd_display_server

nohup nodejs bin/www &
```
- Check that it works locally
```
curl -d '{"text":"Hello pi","move_message":"true"}' http://localhost:3000/messages/ -v  -H "Content-Type: application/json"
```
- Install and run a [dataplicity](https://www.dataplicity.com/) agent to expose the service on internet
- Check that it works remotely
```
curl -d '{"text":"Hello pi","move_message":"true"}' https://xxxxxx.dataplicity.io/messages/ -v  -H "Content-Type: application/json"
```
- Configure an Alexa skill using the content of the alexa folder
- Create a lambda function and have it triggered by you Alexa skill
- Copy-paste the content of [lambda/index.js](lambda/index.js) to the lambda function
- Create a Jenkins job on your [Jenkins](https://jenkins.io/) server configuring 2 job String parameters, APPLICATION and ENVIRONMENT (note: for simplicity's sake, there is no authentication configured to trigger the job. You can easily add an access token to the request headers. It is also possible to use another CI/CD server than Jenkins, the API call must then be updated accordingly)
- Update the values of $JENKINSJOBURL and $DATAPLICITYHOSTNAME on the lambda function with your actual Jenkins job url and dataplicity url

# Demo

- create deployment request, eg:

"Echo, deploy rocket to production using Houston"
- read confirmation code on LCD screen
- confirm deployment, eg:

"Echo, confirm deployment koala"
- read console output on Jenkins
