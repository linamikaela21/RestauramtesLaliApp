import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Carousel } from '../../../components/Shared/Carousel';
import { Loading } from '../../../components/Shared/Loading';
import { db } from '../../../utils';
import { styles } from './RestaurantScreen.styles'

export const RestaurantScreen = (props) => {
    const { route } = props

    const [resto, setResto] = useState(null)

    useEffect(() => {
        setResto(null)
        onSnapshot(doc(db, 'restaurants', route.params.id), doc => {
            setResto(doc.data())
        })
    }, [route.params.id])

    if (!resto) return <Loading show text='Uploading restaurants..' />

    return (
        <ScrollView style={styles.content}>
            <Carousel arrayImages={resto.images} height={250} width={350} />
        </ScrollView>
    )
};