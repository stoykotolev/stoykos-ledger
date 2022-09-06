---
  title: 'Entry [6]'
  date: '2022-06-23'
---

Been a minute I guess....

Got into some _VERY_ basic Python scripting.

After catching myself going to LTT's([Linus Tech Tips](https://www.youtube.com/c/LinusTechTips)) YouTube account to watch videos from his Smart Home creation [playlist](https://www.youtube.com/playlist?list=PL8mG-RkN2uTzgyA8zzE8vRB3_ZXQfuFRz) I decided to build something that will help with tracking this.

That's how I ended up writing this, again, _VERY_ basic Pythong script, that, basically, sends a request via the YT API and checks if the current playlist video count is more than the previous one. If that happens, an email is sent.

Nothing fancing, but it works.

Here is the repo if you'd like to check it out - [https://github.com/stoykotolev/youtube-playlist-checker]

I decided to go the OOP just because I wanted to dip my toes in it. But the main functions of the script are basically:

First I build the YT connector with the API key

```python
youtube = googleapiclient.discovery.build(api_service_name, api_version, developerKey=config('API_KEY', cast=str))
```

Once the connection is done, I setup a request towards the API to get information about the needed playlist:

```python
request = youtube.playlists().list(
            part="contentDetails",
            id=config('YT_PLAYLIST_ID', cast=str)
        )
```

It then checks if the current value is bigger than the old value and if it is, it sends an email:

```python
        # Get the current playlist items count from the response dict.
        response_itemCount = response['items'][0]['contentDetails']['itemCount']
        # Update the count if itemCount is larger than the current playlist_itemCount
        if response_itemCount > playlist_itemCount:
            playlist_itemCount = response_itemCount

            # Once the value has been updated, send an email to notify that a new video is uploaded.
            email_sender.send_email()
```

The EmailSender class itself is as basic as it gets:

```python
class EmailSender:
    def __init__(self):
        self.smtp_server = config('SERVER', cast=str)
        self.password = config('PASSWORD', cast=str)
        self.port = config('PORT', cast=int)

    def send_email(self):
        try:
            # Create a secure smtp server connection
            smtp_server = smtplib.SMTP_SSL(self.smtp_server, self.port)
            smtp_server.ehlo()

            smtp_server.login(sender_email, config('PASSWORD', cast=str))
            smtp_server.send_message(msg)
            smtp_server.close()
        except Exception as ex:
            print("Something went wrong….", ex)
```

Set the required values, establish a SSL encrypted SMTP connection, login and send.

The message is constructed with the help of the email.message lib:

```python
# Email configuration
msg = EmailMessage()

sender_email = config('EMAIL_SENDER', cast=str)
message = "There has been a new email has been uploaded to the provided playlist."

msg['Subject'] = 'A new video has been added to the playlist'
msg['From'] = sender_email
msg['To'] = sender_email
msg.set_content(message)
```

Currently, I have it so that it sends an receives it on the same email, to avoid the need to configure SPF records and so on.

For the future, I _might_ set it up so that it then also requests the n number of videos since the last check and provides their URLs in the email.

But I'll see. Currently feeling like it's time for a redesign for the website. 
