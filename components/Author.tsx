import Image from "next/image";
import React from "react";

type AuthorType = {
  name: string;
  profilePic: string;
  email: string;
};

const Author = ({ name, profilePic, email }: AuthorType) => {
  return (
    <section className="mt-10 flex items-center gap-2">
      {profilePic && (
        <Image
          src={profilePic}
          alt="profilePic"
          width={35}
          height={35}
          className="rounded-full"
        />
      )}
      <div className="leading-4">
        <p className="font-semibold">{name}</p>
        <small className="text-zinc-500">{email}</small>
      </div>
    </section>
  );
};

export default Author;
