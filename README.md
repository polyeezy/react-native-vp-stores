npm i react-native-vp-stores

## Session

### Reducer

```javascript
import {sessionReducer} from 'react-native-vp-stores/reducers';
```

### Configuration

```javascript
const config = {
  allowAnonymous: true,
  providers: ['google', 'apple', 'mail'],
  google: {
    webClientId:
      '748017831786-bvosvd2engjhuhgg7ka9fdg6ievt9aee.apps.googleusercontent.com',
  },
};
```

### Actions

```javascript
import {SessionConfigure} from 'react-native-vp-stores/actions';

const config = {
  allowAnonymous: true,
  providers: ['google', 'apple', 'mail'],
  google: {
    webClientId:
      '748017831786-bvosvd2engjhuhgg7ka9fdg6ievt9aee.apps.googleusercontent.com',
  },
};

SessionConfigure(config);
```

SessionConfigure

SessionLoginAnonymously

SessionRegisterEmail

SessionLoginEmail

SessionIsUserLogged

SessionAuthGoogle

SessionAuthApple
