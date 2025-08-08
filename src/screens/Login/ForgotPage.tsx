import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { ForgotScreenProps } from '../../types/types';



const ForgotPage : React.FC<ForgotScreenProps> = ({ navigation }) => {

    return (
        <View style={styles.container}>

        </View>)
}
export default ForgotPage;

export const styles = StyleSheet.create({

    container: {
    flex: 1,
    padding: 24,
    marginTop: 20,
    backgroundColor: '#fff',
  },
})