import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { styles } from './UserInfo.styles'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker'
import { updateProfile } from 'firebase/auth';


export const UserInfo = (props) => {
    const { userInfo: { uid, photoURL, displayName, email },
        setReloadUserInfo, setLoading, setLoadingText } = props

    const [avatar, setAvatar] = useState(photoURL);

    const changeAvatar = async () => {
        const cameraResults = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!cameraResults.cancelled) uploadImage(result.uri);
    }

    const uploadImage = async (uri) => {
        setLoadingText("Actualizando Avatar");
        setLoading(true);
        const response = await fetch(uri)
        const blob = await response.blob()
        const storage = getStorage();
        const imageRef = ref(storage, `avatar/${uid}`);
        uploadBytes(imageRef, blob)
            .then((snapshot) => {
                updatePhotoUrl(snapshot.metadata.fullPath)
            });
    }

    const updatePhotoUrl = async (imagePath) => {
        const storage = getStorage();
        const imageRef = ref(storage, imagePath);

        const imageUrl = await getDownloadURL(imageRef);

        const auth = getAuth();
        updateProfile(auth.currentUser, { photoURL: imageUrl });

        setAvatar(imageUrl);
        setLoading(false);
        setReloadUserInfo(true)
    };


    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size='large'
                showEditButton={true}
                onPress={() => changeAvatar()}
                containerStyle={styles.userInfoAvatar}
                icon={{ type: "material", name: "person" }}
                source={photoURL ? { uri: avatar } : require('../../../images/profileIcon.png')}
            >
                <Avatar.Accessory size={24} onPress={changeAvatar} />
            </Avatar>
            <View>
                <Text style={styles.displayName}>{displayName ? displayName : 'Anonimo'}</Text>
                <Text>{email ? email : 'Social Login'}</Text>
            </View>
        </View>
    );
}