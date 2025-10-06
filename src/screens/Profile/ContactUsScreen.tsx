import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import Header from "../../components/Header";
import { ForgotScreenProps } from "../../types/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const ContactUsScreen: React.FC<ForgotScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const handleSubmit = async () => {
        if (!email || !message) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("https://elegant-project.onrender.com/api/contact-us", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, message }),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                Alert.alert("Success", "Your message has been sent!");
                setEmail("");
                setMessage("");
            } else {
                Alert.alert("Error", data.message || "Something went wrong");
            }
        } catch (error) {
            setLoading(false);
            Alert.alert("Error", "Failed to send message. Try again later.");
            console.error(error);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1, backgroundColor: "#fff", bottom: insets.bottom ,  paddingHorizontal: 20, }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.container}>
                <Header text={"Contact Us"} onPress={handleGoBack} />

                <ScrollView 
                    contentContainerStyle={styles.containerIn} 
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.inputFieldContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Text style={styles.label}>Message</Text>
                        <TextInput
                            placeholder="Your Message"
                            multiline
                            style={[styles.input, styles.textArea]}
                            value={message}
                            onChangeText={setMessage}
                        />
                    </View>
                </ScrollView>

                {/* Button fixed at bottom */}
                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleSubmit} 
                        disabled={loading}
                    >
                        {loading 
                          ? <ActivityIndicator color="#fff" /> 
                          : <Text style={styles.buttonText}>Send</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff',paddingTop: 20 },
    containerIn: { padding: 20, flexGrow: 1 },
    textArea: {
        height: 200, // larger text box
        textAlignVertical: "top",
    },
    footer: {
        padding: 20,
        paddingBottom:40,
        borderColor: "#ddd",
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#704f38",
        padding: 15,
        borderRadius: 25,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    inputFieldContainer: {
        paddingVertical: 20,
    },
    label: {
        marginBottom: 6,
        fontSize: 16,
        marginLeft: 5,
        fontWeight: '500',
        color: '#000000',
        fontFamily: 'Poppins',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 12,
        fontSize: 15,
    },
});

export default ContactUsScreen;
