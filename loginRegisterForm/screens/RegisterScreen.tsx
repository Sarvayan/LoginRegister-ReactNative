import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import auth from '@/services/firebaseAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({navigation}: any) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [isEmailFocused, setIsEmailFocused] = React.useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    function handleRegister() {
        if (!emailRegex.test(email)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: 'Please enter a valid email address',
            });
            return;
        }
        if (!passwordRegex.test(password)) {
            Toast.show({
                type: 'error',
                text1: 'Weak Password',
                text2: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
            });
            return;
        }

        setIsLoading(true);
        
        createUserWithEmailAndPassword(auth,email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                AsyncStorage.setItem('user', JSON.stringify(user));
                Toast.show({
                    type: 'success',
                    text1: 'Registration Successful',
                    text2: 'Your account has been created successfully!',
                });
                console.log("User registered successfully:", user);
                navigation.navigate('dashboard');
            })
            .catch((error) => {
                let errorMessage = "Registration failed. Please try again.";
                
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'This email is already in use.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'Password is too weak.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Email address is invalid.';
                }
                
                Toast.show({
                    type: 'error',
                    text1: 'Registration Failed',
                    text2: errorMessage,
                });
                console.error("Error during registration:", error.code, error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function goToLogin() {
        navigation.navigate('login');
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
        >
            <ThemedView style={styles.themedViewContainer}>
                <View style={styles.logoContainer}>
                    <Ionicons name="document-text" size={48} color="#6366f1" />
                    <Text style={styles.logoText}>SamForm</Text>
                    <Text style={styles.logoSubtext}>Create your account</Text>
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={[styles.inputWrapper, isEmailFocused && styles.focusedInput]}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your email"
                            placeholderTextColor="#9ca3af"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
                        />
                        {email.length > 0 && (
                            <Ionicons 
                                name={emailRegex.test(email) ? "checkmark-circle" : "close-circle"} 
                                size={20} 
                                color={emailRegex.test(email) ? "#10b981" : "#ef4444"} 
                                style={styles.inputIcon}
                            />
                        )}
                    </View>
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[styles.inputWrapper, isPasswordFocused && styles.focusedInput]}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Create a password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry={secureTextEntry}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon}
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                        >
                            <Ionicons 
                                name={secureTextEntry ? "eye-off" : "eye"} 
                                size={20} 
                                color="#6b7280" 
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.passwordStrengthContainer}>
                        {[
                            {label: '8+ chars', regex: /.{8,}/},
                            {label: 'A-Z', regex: /[A-Z]/},
                            {label: 'a-z', regex: /[a-z]/},
                            {label: '0-9', regex: /\d/},
                            {label: 'Special', regex: /[@$!%*?&]/}
                        ].map((rule) => (
                            <View key={rule.label} style={[
                                styles.passwordRule,
                                rule.regex.test(password) && styles.fulfilledRule
                            ]}>
                                <Ionicons 
                                    name={rule.regex.test(password) ? "checkmark-circle" : "close-circle"} 
                                    size={14} 
                                    color={rule.regex.test(password) ? "#10b981" : "#ef4444"} 
                                />
                                <Text style={[
                                    styles.passwordRuleText,
                                    rule.regex.test(password) && styles.fulfilledRuleText
                                ]}>{rule.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Ionicons name="refresh" size={24} color="white" style={styles.loadingIcon} />
                    ) : (
                        <Text style={styles.buttonText}>Create Account</Text>
                    )}
                </TouchableOpacity>
                
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity>
                        <Text style={styles.loginLink} onPress={goToLogin}> Sign In</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                        By creating an account, you agree to our 
                        <Text style={styles.termsLink}> Terms of Service</Text> and 
                        <Text style={styles.termsLink}> Privacy Policy</Text>.
                    </Text>
                </View>
            </ThemedView>
            <Toast />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    themedViewContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 32,
        paddingVertical: 40,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#6366f1',
        marginTop: 12,
        letterSpacing: -0.5,
        fontFamily: 'Inter_700Bold',
    },
    logoSubtext: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 8,
        fontFamily: 'Inter_400Regular',
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputWrapper: {
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    label: {
        fontSize: 14,
        color: '#334155',
        marginBottom: 8,
        fontWeight: '600',
        fontFamily: 'Inter_500Medium',
    },
    textInput: {
        height: 52,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1e293b',
        paddingRight: 40,
        fontFamily: 'Inter_400Regular',
    },
    inputIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    passwordStrengthContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 12,
    },
    passwordRule: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    passwordRuleText: {
        fontSize: 12,
        color: '#475569',
        marginLeft: 4,
        fontFamily: 'Inter_500Medium',
    },
    registerButton: {
        height: 52,
        backgroundColor: '#6366f1',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'row',
    },
    registerButtonDisabled: {
        backgroundColor: '#a5b4fc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter_600SemiBold',
        marginLeft: 8,
    },
    loadingIcon: {
        marginRight: 8,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        alignItems: 'center',
    },
    loginText: {
        color: '#64748b',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    loginLink: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Inter_600SemiBold',
        marginLeft: 4,
    },
    termsContainer: {
        marginTop: 32,
        paddingHorizontal: 16,
    },
    termsText: {
        color: '#94a3b8',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        fontFamily: 'Inter_400Regular',
    },
    termsLink: {
        color: '#6366f1',
        fontWeight: '500',
        fontFamily: 'Inter_500Medium',
    },
    focusedInput: {
        borderColor: '#6366f1',
        backgroundColor: '#f8fafc',
        shadowColor: '#a5b4fc',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
    },
    fulfilledRule: {
        backgroundColor: '#e0e7ff',
    },
    fulfilledRuleText: {
        color: '#6366f1',
    },
});