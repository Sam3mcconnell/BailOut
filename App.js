import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegisterScreen from './screens/RegisterScreen';
import EmailRegisterScreen from './screens/EmailRegisterScreen';
import BailOutScreen from './screens/BailOutScreen';
import LocalProfileScreen from './screens/LocalProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import AddFriendsScreen from './screens/AddFriendsScreen';
import RequestedScreen from './screens/ReqestedScreen';
import FirstRegisterInfoScreen from './screens/FirstRegisterInfoScreen';
import ChangePinScreen from './screens/ChangePinScreen';
import FriendsProfileScreen from './screens/FriendsProfileScreen';
import LocationTestScreen from './screens/LocationTestScreen';
import FriendLocationScreen from './screens/FriendLocationScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>   
          <Stack.Screen name="Email" component={EmailRegisterScreen} options={{headerShown: false}}/> 
          <Stack.Screen name="FirstRegisterInfo" component={FirstRegisterInfoScreen} options={{headerShown: false}}/> 
          <Stack.Screen name="Home" component={TabScreen} options={{headerShown: false}}/>          
          <Stack.Screen name="FriendsProfile" component={FriendsProfileScreen} options={{headerShown: false}}/>
          <Stack.Screen name="LocationTest" component={LocationTestScreen} options={{headerShown: false}}/>
          <Stack.Screen name="FriendLocation" component={FriendLocationScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>

  );
}

function TabScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="BailOut" component={BailOutScreen} options={{tabBarStyle: {display: "none"}, headerShown: false}}/>  
      <Tab.Screen name="LocalProfile" component={LocalProfileScreen} options={{tabBarStyle: {display: "none"}, headerShown: false}}/> 
      <Tab.Screen name="EditProfile" component={EditProfileScreen} options={{tabBarStyle: {display: "none"}, headerShown: false}}/>
      <Tab.Screen name="ChangePin" component={ChangePinScreen} options={{tabBarStyle: {display: "none"}, headerShown: false}}/> 
      <Tab.Screen name="AddFriends" component={AddFriendsScreen} options={{tabBarStyle: {display: "none"}, headerShown: false}}/> 
      <Tab.Screen name="Requested" component={RequestedScreen} options={{tabBarStyle: {display: "none"}, headerShown: false}}/> 
      
    </Tab.Navigator>
  )
  
}
