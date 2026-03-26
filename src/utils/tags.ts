const getStatusColor = (status: string) => {
    switch (status) {
        case "OPEN": return "brand.500";
        case "IN_PROGRESS": return "blue.400";
        case "RESOLVED": return "green.400";
        case "CLOSED": return "gray.500";
        default: return "gray.400";
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "LOW": return "green.500";
        case "MEDIUM": return "yellow.500";
        case "HIGH": return "orange.500";
        case "URGENT": return "red.500";
        default: return "gray.400";
    }
};

const priorityTranslator = (priority: string) => {
    switch (priority) {
        case "LOW": return "Baixa";
        case "MEDIUM": return "Média";
        case "HIGH": return "Alta";
        case "URGENT": return "Urgente";
        default: return "Desconhecida";
    }
};

export { getStatusColor, getPriorityColor, priorityTranslator };