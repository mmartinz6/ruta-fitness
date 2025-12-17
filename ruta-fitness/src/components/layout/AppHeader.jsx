function AppHeader({ toggleSidebar }) {
    const [usuario, setUsuario] = React.useState(null);

    React.useEffect(() => {
        const rawUser = localStorage.getItem("usuarioActivo");
        if (rawUser) {
            setUsuario(JSON.parse(rawUser));
        }
    }, []);

    return (
        <header
            className="bg-white shadow-md h-16 flex items-center justify-between px-4 border-b border-gray-200
            fixed top-0 z-50 w-full 
            lg:left-64 lg:w-[calc(100%-16rem)]"
        >
            <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 lg:hidden"
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 text-gray-800 text-xl font-semibold hidden lg:block">
                {usuario
                    ? `Bienvenido, ${usuario.first_name || usuario.username} 💙`
                    : "TU SALUD ES NUESTRA PRIORIDAD"}
            </div>
        </header>
    );
}
