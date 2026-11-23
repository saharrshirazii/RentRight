
export const handleAuthError = (status:number) => {
    if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if(typeof (window as any).triggerSessionExpired === 'function') {
            (window as any).triggerSessionExpired();
        }
    }
};