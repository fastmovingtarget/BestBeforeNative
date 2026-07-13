//2026-07-10 : Profile page to test logout

import { ButtonView, PageView } from '@/ui/BestBeforeUI';
import {Text} from 'react-native';
import {useAuthenticationData} from '@/Contexts/Authentication/AuthenticationDataProvider';

export function ProfilePage() {
    const { logout } = useAuthenticationData();

    return (
        <PageView style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <ButtonView style={{padding:10, margin:10, backgroundColor:"red", borderRadius:5}} onPress={() => logout()}>
                <Text>Log out</Text>
            </ButtonView>
        </PageView>
    )
}