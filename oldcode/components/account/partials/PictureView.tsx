import { StyleSheet, Text, View, Dimensions, Image, Animated } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export const PictureView = () => {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 60 }}>
                </View>
                <View style={{ flex: 1 }}>
                    {this.renderUsers()}
                </View>
                <View style={{ height: 60 }}>
                </View>
            </View>
        );
    }
}
