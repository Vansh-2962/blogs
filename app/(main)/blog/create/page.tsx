import CreateBlogForm from "@/components/CreateBlogForm";

const CreateBlogPage = () => {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <CreateBlogForm title={"Create Blog"} buttonText={"Publish"} />
    </main>
  );
};

export default CreateBlogPage;
