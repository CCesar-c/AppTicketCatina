import { TouchableOpacity, Text, View } from "react-native";

export function NewButton({style, children, onPress, ...props }) {
    return (
        <View>
            <TouchableOpacity style={style || { borderWidth:1, borderColor:"black" }} onPress={onPress} {...props} >
                <Text>
                    {children}
                </Text>
            </TouchableOpacity>
        </View>
    )
}


export default NewButton;