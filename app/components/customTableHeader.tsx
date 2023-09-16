export const CustomTableHeader = () => {
  return (
    <div className="flex gap-4 pl-[4.5rem] items-center bg-[#18181b] rounded-tl-lg rounded-tr-lg py-2 relative select-none">
      <div className="text-center w-[200px]">NAME</div>
      <div className="text-center w-full shrink">MESSAGE</div>
    </div>
  );
};
