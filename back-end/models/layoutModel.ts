import mongoose,{Document} from "mongoose";

interface FaqItem extends Document {
    question: string;
    answer: string;
}

interface Category extends Document {
    title: string
}

interface BannerImage extends Document {
    public_id : string;
    url: string;
}

interface Layout extends Document{
    type : string;
    faq: FaqItem[];
    categories: Category[];
    banner: {
        image: BannerImage;
        title: string;
        subTitle: string;
    }
}


// Schema 
const FaqSchema = new mongoose.Schema<FaqItem> ({
    question: {type: String,trim: true},
    answer: {type: String, trim: true}
});
const CategorySchema = new mongoose.Schema<Category> ({
    title: {type: String, trim: true}
});

const BannerImageSchema = new mongoose.Schema<BannerImage> ({
    public_id: {type: String},
    url: {type: String}
});

const LayoutSchema = new mongoose.Schema<Layout> ({
    type: {type: String, required: true},
    faq: [FaqSchema],
    categories: [CategorySchema],
    banner: {
        image: BannerImageSchema,
        title: {type: String, trim: true},
        subTitle: {type: String, trim: true}
    }
},{timestamps:true});

const Layout = mongoose.model<Layout>("Layout", LayoutSchema);

export default Layout