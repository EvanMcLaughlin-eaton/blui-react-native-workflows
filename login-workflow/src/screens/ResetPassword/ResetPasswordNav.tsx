/**
 * @packageDocumentation
 * @module Screens
 */

import * as React from 'react';

// Nav
import { createStackNavigator } from '@react-navigation/stack';

// Hooks
import { useRoute } from '@react-navigation/native';

// Screens
import { ResetPassword } from '../../subScreens/ResetPassword';
import { ResetPasswordSent } from '../../subScreens/ResetPasswordSent';

// Components
import { CloseHeader } from '../../components/CloseHeader';

// Theme
import { Theme, useTheme } from 'react-native-paper';

// Shared Auth Logic
import {
    // Actions
    AccountActions,
    // Types
    ContactParams,
    // Hooks
    useAccountUIState,
    useAccountUIActions,
    useLanguageLocale,
} from '@pxblue/react-auth-shared';

/**
 * Stack navigator for reset password navigation.
 */
const Stack = createStackNavigator();

/**
 * @param theme  (Optional) react-native-paper theme partial to style the component.
 */
type ResetPasswordNavProps = {
    theme?: Theme;
};

/**
 * Renders a screen stack which handles the reset password flow.
 *
 * @category Component
 */
export const ResetPasswordNav: React.FC<ResetPasswordNavProps> = (props) => {
    const { t } = useLanguageLocale();
    const theme = useTheme(props.theme);
    const accountUIState = useAccountUIState();
    const accountUIActions = useAccountUIActions();
    const route = useRoute();

    // Reset state on dismissal
    React.useEffect(
        () => (): void => {
            accountUIActions.dispatch(AccountActions.resetPasswordReset());
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const resetPassword = (emailInput: string): void => {
        accountUIActions.actions.forgotPassword(emailInput);
    };

    const routeParams = route.params as ContactParams;
    const contactPhone = routeParams?.contactPhone ?? '';

    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: theme.colors.surface,
                headerStyle: { backgroundColor: theme.colors.primary },
            }}
        >
            {accountUIState.forgotPassword.transitSuccess !== true ? (
                <Stack.Screen
                    name="ResetPassword"
                    initialParams={{ onResetPasswordPress: resetPassword, contactPhone: contactPhone }}
                    component={ResetPassword}
                    options={({ navigation }): object => ({
                        header: (): JSX.Element | null =>
                            CloseHeader({
                                title: t('FORMS.RESET_PASSWORD'),
                                backAction: () => {
                                    navigation.goBack();
                                },
                            }),
                    })}
                />
            ) : (
                <Stack.Screen
                    name="ResetPasswordSent"
                    component={ResetPasswordSent}
                    initialParams={{ email: accountUIState.forgotPassword.email }}
                    options={({ navigation }): object => ({
                        gestureEnabled: false,
                        header: (): JSX.Element | null =>
                            CloseHeader({
                                title: t('FORMS.RESET_PASSWORD'),
                                backAction: () => {
                                    navigation.navigate('Login');
                                },
                            }),
                    })}
                />
            )}
        </Stack.Navigator>
    );
};
