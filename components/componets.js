import { TouchableOpacity, Text, View } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../contexts/themeContext";
export function NewButton({ style, children, onPress, ...props }) {
    const { theme } = useContext(ThemeContext);
    return (
        <View>
            <TouchableOpacity style={[style, { backgroundColor: theme.buttonBackground }]} onPress={onPress} {...props}  >
                <Text style={[{ textAlign: 'center', padding: 10, }, { color: theme.buttonText }]} >
                    {children}
                </Text>
            </TouchableOpacity>
        </View >
    )
}


export default NewButton;