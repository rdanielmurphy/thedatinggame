const initialState = {
    loading: false,
    userName: '',
    email: ''
}

export const user = (state = initialState, action: any) => {
    return {
        ...state,
        userName: action.currentUser?.name,
        email: action.currentUser?.email,
        loading: action.loading
    }
}
