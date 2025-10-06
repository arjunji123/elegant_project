import { Text,View,Pressable, StyleSheet,Image } from "react-native"
import Arrowleft from "../assets/icons/Arrowleft.png";

const Header = ({text, onPress})=>{
return(

   <View style={styles.header}>
          <Pressable onPress={onPress}>
            <Image source={Arrowleft} style={styles.backIcon} />
          </Pressable>
          <Text style={styles.headerTitle}>{text}</Text>
        </View> 
)

}
const styles = StyleSheet.create({
  header: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { padding: 2 },
  backIcon: { width: 35, height: 35, resizeMode: "contain" },
    headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
    // fontFamily: 'Poppins',
    marginRight: 40,
  },
})
export default Header