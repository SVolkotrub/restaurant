"use clinet";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
};
type Option = {
  title: string;
  additionalPrice: number;
};

export default function AddPage() {
  const { data: session, status } = useSession();
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
  });
  const [file, setFile] = useState<File>();
  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });
  const [options, setOptions] = useState<Option[]>([]);
  const router = useRouter();
  if (status === "loading") {
    return <p>Loading</p>;
  }
  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/");
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const upload = async () => {
    const data = new FormData();
    data.append("file", file!);
    data.append("upload_preset", "restaurant");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/svolkotrub/image`,
      {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: data,
      }
    );
    const resData = await res.json();
    return resData.url;
  };
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = await upload();
      const res = await fetch(`http://localhost:3000/api/products`, {
        method: "POST",
        body: JSON.stringify({
          img: url,
          ...inputs,
          options,
        }),
      });
      const data = await res.json();
      router.push(`/product/${data.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center text-red-500">
      <form className="flex flex-wrap gap-6" onSubmit={handleSubmit}>
        <h1 className="text-4xl mb-2 text-gray-300 font-bold">
          Add new product
        </h1>
        <div className="w-full flex flex-col gap-2 ">
          <label
            className="text-sm cursor-pointer flex gap-4 items-center"
            htmlFor="file"
          >
            <Image src="/upload.png" alt="" width={30} height={20} />
            <span>Upload Image</span>
          </label>
          <input
            className="hidden"
            type="file"
            id="file"
            onChange={handleChangeImage}
          />
          <br />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Title</label>
          <input
            onChange={handleChange}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="Bella Napoli"
            name="title"
          />
          <br />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Descrittion</label>
          <textarea
            rows={3}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            onChange={handleChange}
          />
          <br />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Price</label>
          <input
            onChange={handleChange}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="number"
            placeholder="29"
            name="price"
          />
          <br />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Category</label>
          <input
            onChange={handleChange}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="pizzas"
            name="catSlug"
          />
          <br />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Options</label>
          <div>
            <input
              onChange={changeOption}
              className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
              type="text"
              placeholder="Title"
              name="title"
            />
            <input
              onChange={changeOption}
              className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
              type="number"
              placeholder="Additional Price"
              name="additionalPrice"
            />
          </div>
          <div
            className="w-52 bg-red-500 text-white p-2"
            onClick={() => setOptions((prev) => [...prev, option])}
          >
            Add option
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          {options.map((item) => (
            <div
              className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400"
              key={item.title}
              onClick={() =>
                setOptions(options.filter((opt) => opt.title !== item.title))
              }
            >
              <span>{item.title}</span>
              <span className="text-xs">(+ ${item.additionalPrice})</span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-red-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
