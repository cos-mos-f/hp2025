const healthRoute = async (app) => {
    app.get('/health', async () => {
        return { ok: true, time: new Date().toISOString() };
    });
};
export default healthRoute;
//# sourceMappingURL=health.js.map