import Client from "../domain/client.entity";

export default interface ClientGateway {
    add(Client: Client): Promise<void>;
    find(id: string): Promise<Client>;
}