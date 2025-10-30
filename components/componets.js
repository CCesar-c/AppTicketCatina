import { TouchableOpacity, Text, View } from "react-native";

export function NewButton({style,children, onPress }) {
    return (
        <View>
            <TouchableOpacity style={style || { borderWidth:1, borderColor:"black" }} onPress={onPress} >
                <Text>
                    {children}
                </Text>
            </TouchableOpacity>
        </View>
    )
}


export default NewButton;