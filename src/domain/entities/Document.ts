export class Document {
    public readonly id: string;
    public name: string;
    public tags: string[];
    public createdAt: Date;
    public updatedAt: Date;
    public creatorId: string;

    constructor(
        name: string,
        creatorId: string,
        tags: string[] = [],
    ) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.tags = tags;
        this.createdAt = new Date()
    }
}