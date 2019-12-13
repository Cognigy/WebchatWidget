# Custom Avatars
During the conversation, you can swap the image URLs used for `Bot` and `User` avatars by sending certain message content:

Set a user avatar override
```json
{
  "_webchat": {
   " userAvatarOverrideUrl": "https://placekitten.com/200/200"
  }
}
```

Reset the user avatar
```json
{
  "_webchat": {
    "userAvatarOverrideUrl": ""
  }
}
```

Set a bot avatar override
```json
{
  "_webchat": {
    "botAvatarOverrideUrl": "https://placekitten.com/200/200"
  }
}
```

Reset the bot avatar
```json
{
  "_webchat": {
    "botAvatarOverrideUrl": ""
  }
}
```

Set an agent avatar override
```json
{
  "_webchat": {
    "agentAvatarOverrideUrl": "https://placekitten.com/200/200"
  }
}
```

Reset the agent avatar
```json
{
  "_webchat": {
    "agentAvatarOverrideUrl": ""
  }
}
```