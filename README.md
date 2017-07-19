# Description

Use voice control to trigger a deployment secured by a confirmation code sent to a screen collocalized with the voice controller.

# Details

- Voice control using Alexa
- Logic layer using Lambda
- Deployment using Jenkins job
- Confirmation code sent on a API exposed by a node.js server running on local network Raspberry Pi
- Confirmation code displayed by the raspberry pi on a LCD display screen

# Demo

- plug in raspberry pi
- ssh to raspberry 

```
ssh pi@192.168.0.124
```
- start nodejs server

```
cd houston

nohup nodejs bin/www &
```
- start up instance **Houston-jenkins** on [AWS](https://ap-southeast-2.console.aws.amazon.com/ec2/v2/home?region=ap-southeast-2#Instances:sort=instanceId). /For now, you need to update the lambda with the new Jenkins url (as it is not a fixed url, no elastic Ip)/.
- create deployment request, eg:

"Echo, deploy rocket to production using Houston"
- read confirmation code on LCD screen
- confirm deployment, eg:

"Echo, confirm deployment koala"
- read console output on [jenkins](http://$JENKINSJOBURL/job/Houston/)

# TODO:
Get dynamic jenkins URL from lambda
