import React from 'react'

const Test = () => {
  return (
    <div class="max-w-5xl mx-auto bg-white shadow-md rounded-xl overflow-hidden mt-10">
  {/* <!-- Header Gradient --> */}
  <div class="h-24 bg-gradient-to-r from-blue-200 to-yellow-100"></div>

  {/* <!-- Profile Content --> */}
  <div class="p-6 -mt-12">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <img src="https://i.pravatar.cc/100?img=1" class="w-20 h-20 rounded-full border-4 border-white shadow-md" />
        <div>
          <h2 class="text-xl font-bold">Alexa Rawles</h2>
          <p class="text-gray-500 text-sm">alexarawles@gmail.com</p>
        </div>
      </div>
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Edit</button>
    </div>

    {/* <!-- Form Grid --> */}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* <!-- Left --> */}
      <div class="space-y-4">
        <div>
          <label class="text-gray-600 text-sm">Full Name</label>
          <input type="text" placeholder="Your First Name" class="w-full bg-gray-100 p-2 rounded-md" />
        </div>
        <div>
          <label class="text-gray-600 text-sm">Gender</label>
          <select class="w-full bg-gray-100 p-2 rounded-md">
            <option>Your First Name</option>
          </select>
        </div>
        <div>
          <label class="text-gray-600 text-sm">Language</label>
          <select class="w-full bg-gray-100 p-2 rounded-md">
            <option>Your First Name</option>
          </select>
        </div>
      </div>

      {/* <!-- Right --> */}
      <div class="space-y-4">
        <div>
          <label class="text-gray-600 text-sm">Nick Name</label>
          <input type="text" placeholder="Your First Name" class="w-full bg-gray-100 p-2 rounded-md" />
        </div>
        <div>
          <label class="text-gray-600 text-sm">Country</label>
          <select class="w-full bg-gray-100 p-2 rounded-md">
            <option>Your First Name</option>
          </select>
        </div>
        <div>
          <label class="text-gray-600 text-sm">Time Zone</label>
          <select class="w-full bg-gray-100 p-2 rounded-md">
            <option>Your First Name</option>
          </select>
        </div>
      </div>
    </div>

    {/* <!-- Email Section --> */}
    <div class="mt-10">
      <h3 class="font-semibold text-gray-800 mb-4">My email Address</h3>
      <div class="flex items-center space-x-4">
        <div class="bg-blue-100 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H8m0 0l4-4m-4 4l4 4" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-800">alexarawles@gmail.com</p>
          <p class="text-xs text-gray-500">1 month ago</p>
        </div>
      </div>
      <button class="mt-4 text-blue-600 font-medium hover:underline">+Add Email Address</button>
    </div>
  </div>

  <div className="grid grid-cols-3 gap-4">
  <div className="bg-red-200">Cột 1</div>
  <div className="bg-green-200">Cột 2</div>
  <div className="bg-blue-200">Cột 3</div>

  <div className="grid grid-cols-4 gap-4">
  <div className="col-span-2 bg-red-200">Chiếm 2 cột</div>
  <div className="col-span-1 bg-green-200">1 cột</div>
  <div className="col-span-1 bg-blue-200">1 cột</div>

  <div className="space-y-4">
  <div className="bg-red-300 h-10">Box 1</div>
  <div className="bg-green-300 h-10">Box 2</div>
  <div className="bg-blue-300 h-10">Box 3</div>
</div>

</div>
</div>

</div>



  )
}

export default Test
