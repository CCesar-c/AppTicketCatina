import { TouchableOpacity, Text, View } from "react-native";

export function NewButton({ style, children, onPress, ...props }) {
    return (
        <View>
            <TouchableOpacity style={style || { borderColor: 'black', borderWidth: 1, borderRadius: 10, }} onPress={onPress} {...props}  >
                <Text style={{ textAlign: 'center', padding: 10 }} >
                    {children}
                </Text>
            </TouchableOpacity>
        </View>
    )
}


export default NewButton;