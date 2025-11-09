import { TouchableOpacity, Text, View } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../contexts/themeContext";
export function NewButton({ style, children, onPress, ...props }) {
    const { theme } = useContext(ThemeContext);
    return (
        <View>
            <TouchableOpacity style={[{ margin: 2, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.buttonBackground, borderRadius: 10, height: 50, textAlign: 'center', width: 100, borderColor: theme.borderColor, borderWidth: 1 }, style]} onPress={onPress} {...props}  >
                <Text style={[{ color: theme.buttonText, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }]} >
                    {children}
                </Text>
            </TouchableOpacity>
        </View >
    )
}


export default NewButton;