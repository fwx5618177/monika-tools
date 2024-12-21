import Response from '../models/Response';

const createResponse = async (responseData: any) => {
    const response = new Response(responseData);
    return response.save();
};

const getResponseById = async (id: string) => {
    return Response.findById(id);
};

export default {
    createResponse,
    getResponseById
};
