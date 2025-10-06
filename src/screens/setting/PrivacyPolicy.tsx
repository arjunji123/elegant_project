import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Collapsible from "react-native-collapsible";
import Header from "../../components/Header";
import phone from "../../assets/images/phone.png"
const PrivacyPage = ({ navigation }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        { question: "How do I track my order?", answer: "You can track your order from the orders section in your profile." },
        { question: "What is your return policy?", answer: "You can return within 7 days of delivery with original packaging." },
        { question: "Payment Methods do you accept?", answer: "We accept Credit Card, Debit Card, UPI and Wallets." },
        { question: "How to find Refund Policy?", answer: "Refund policy is available in the Help section of our app." },
        { question: "How to return a product?", answer: "Go to Orders → Select product → Click on Return." },
    ];

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const handleGoBack = () => navigation.goBack();

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <Header text={"Privacy Page"} onPress={handleGoBack} />

            {/* Paragraph */}
            <Text style={styles.paragraph}>
                Egestas nunc neque sed lobortis tellus, sociis justo felis. Id amet orci auctor diam dolor et metus. Fringilla nulla mauris fermentum, nisl diam diam. Urna maecenas id non enim massa id quis magna. Vulputate sapien elit habitasse elementum nibh aliquam sed. Nisi aliquet mus commodo interdum nisi, faucibus. Aliquet lectus ipsum massa viverra urna egestas.
            </Text>
            <Text style={styles.paragraph}>
                Libero vulputate porta nisl tortor vitae. Proin pellentesque parturient ac euismod tortor malesuada pellentesque. Turpis leo blandit tristique eu phasellus viverra. Faucibus neque, urna nunc quis id. In luctus sagittis vitae aliquet. Felis dolor in sit arcu ut enim dis. Nibh molestie cursus euismod lacus leo, arcu magna enim blandit.
            </Text>
            {/* Social Media Buttons */}
            <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton}>
                    <Icon name="logo-facebook" size={22} color="#4267B2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Icon name="logo-instagram" size={22} color="#C13584" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Icon name="logo-twitter" size={22} color="#1DA1F2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Icon name="logo-youtube" size={22} color="#FF0000" />
                </TouchableOpacity>
            </View>

            {/* FAQ */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>FAQs</Text>
            </View>
            {faqs.map((faq, index) => (
                <View key={index}>
                    <TouchableOpacity
                        style={styles.faqRow}
                        onPress={() => toggleFAQ(index)}
                    >
                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                        <Icon
                            name={activeIndex === index ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#000"
                        />
                    </TouchableOpacity>
                    <Collapsible collapsed={activeIndex !== index}>
                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </Collapsible>
                </View>
            ))}

            {/* Contact Us */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Contact Us</Text>
            </View>
            <Image
                source={phone}
                style={styles.contactImage}
            />
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle]}>Contact Us</Text>
            </View>
           <View style={styles.centerContainer}>
  <Text style={styles.centeredPara}>
    If you face any trouble for item ordering feel free to contact us.
  </Text>
</View>
            <View style={styles.contactBox}>
                <View style={styles.contactRow}>
                    <Icon name="call-outline" size={20} color="#6b4226" />
                    <Text style={styles.contactText}>+91 7022 327 668</Text>
                </View>
                <View style={styles.contactRow}>
                    <Icon name="mail-outline" size={20} color="#6b4226" />
                    <Text style={styles.contactText}>help@myshop.com</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    headerText: { fontSize: 18, fontWeight: "600", marginLeft: 12 },
    paragraph: { fontSize: 14, color: "#444", marginBottom: 20, lineHeight: 20 },
    socialRow: { flexDirection: "row", justifyContent: "center", marginVertical: 16 },
    socialButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 30,
        padding: 10,
        marginHorizontal: 6,
    },
    sectionHeader: {
        alignItems: "center",   // centers children horizontally
        marginVertical: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },

    faqRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
  centerContainer: {
  alignItems: "center",   // centers children horizontally
  justifyContent: "center",
  marginHorizontal: 20,
},

centeredPara: {
  fontSize: 14,
  color: "#707070",
  textAlign: "center",   // centers paragraph text
  lineHeight: 20,
},
    faqQuestion: { fontSize: 14, fontWeight: "500" },
    faqAnswer: { fontSize: 13, color: "#555", paddingVertical: 8 },
    contactImage: { width: "100%", height: 300, borderRadius: 8, marginVertical: 10 },
    contactBox: { paddingBottom: 20 },
    contactRow: { flexDirection: "row", padding: 10, borderRadius: 10, backgroundColor: "#F0F0F0", borderColor: "#ddd", alignItems: "center", marginVertical: 6 },
    contactText: { marginLeft: 10, fontSize: 14, color: "#704F38" },
});

export default PrivacyPage;
