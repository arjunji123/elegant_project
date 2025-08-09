import { TouchableOpacity, Text, StyleSheet, View} from 'react-native';

import { ButtonProps } from '../types/types';

const button : React.FC<ButtonProps> = ({ text, onPress, bgColor, textColor, border  })=>{
return (
          <View style={styles.buttonContainer}>

    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }, border && { borderWidth: 1, borderColor: border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
     </View>
  );
};

    const styles = StyleSheet.create({
     button: {
     
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50, // Makes the button fully rounded
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
   buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    
    fontSize: 18,
    fontWeight: 'regular',
  },
    })



export default button