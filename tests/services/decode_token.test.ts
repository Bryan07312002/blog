import { UUID } from "crypto";
import { DecodeToken, JwtRepository, Token } from "../../src/services";
import { jest } from "@jest/globals";
import { mockJwtRepository } from "./dependencies_mocks";

describe("DecodeToken", () => {
    let decodeToken: DecodeToken;
    let jwtRepository: jest.Mocked<JwtRepository>;

    beforeEach(() => {
        jwtRepository = mockJwtRepository() as any;
        decodeToken = new DecodeToken(jwtRepository);
    });

    test("should decode the token and return the UUID", () => {
        const mockToken = "mockToken" as Token;
        const mockUUID = "123e4567-e89b-12d3-a456-426614174000" as UUID;
        const expectedResult = { uuid: mockUUID };

        jwtRepository.decode.mockReturnValue(expectedResult);

        const result = decodeToken.execute(mockToken);

        expect(jwtRepository.decode).toHaveBeenCalledWith(mockToken);
        expect(result).toEqual(expectedResult);
    });

    test("should throw if token decoding fails", () => {
        const mockToken = "mockToken" as Token;
        const decodingError = new Error("Token decoding failed");

        jwtRepository.decode.mockImplementation(() => {
            throw decodingError;
        });

        expect(() => decodeToken.execute(mockToken)).toThrow(decodingError);
    });
});
