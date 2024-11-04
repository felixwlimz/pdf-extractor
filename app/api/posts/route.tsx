import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/database';
import postModels from '@/models/postModels';


export async function GET() {
  try {
    await connectDB();
    const data = await postModels.find().lean();
    const uploadsDir = "uploads"; // The directory you want to extract
    const updatedPosts = data.map(post => ({
      ...post,
      filepath: post.drive_upload && post.filepath.includes(uploadsDir)
        ? post.filepath.substring(post.filepath.indexOf(uploadsDir))
        : post.filepath,

    }));

    // Set success message
    const statusMessage = updatedPosts.length > 0 ? "Success" : "Failed";

    return new Response(JSON.stringify({ data: updatedPosts, statusMessage }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ errMsg: (error as Error).message, statusMessage: "Failed" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
export async function POST(req: Request) {
  try {
    await connectDB();

    // Parse the request body
    const { filepath, time, no_files, drive_upload, way_extract, success } = await req.json();
    const missingFields: string[] = [];

    // Validate that required fields are present
    if (!filepath) missingFields.push('filepath');
    if (!time) missingFields.push('time');
    if (no_files == null) missingFields.push('no_files');
    if (drive_upload == null) missingFields.push('drive_upload');
    if (way_extract == null) missingFields.push('way_extract');
    if (success == null) missingFields.push('success');
    
    // If there are any missing fields, return a 400 error with details
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ errMsg: `The following fields are required: ${missingFields.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert the data into the database
    const newPost = await postModels.create({
      filepath,
      time,
      no_files,
      drive_upload,
      way_extract,
      success,
    });

    return new Response(JSON.stringify({ data: newPost }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ errMsg: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
// import { useEffect, useState } from 'react';

// const PostsComponent = () => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const response = await fetch('/api/posts');
//       const data = await response.json();
//       setPosts(data);
//     };

//     fetchPosts();
//   }, []);

//   const createPost = async () => {
//     const newPost = { title: 'New Post', content: 'This is a new post.' };
    
//     await fetch('/api/posts', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(newPost),
//     });

//     // Refresh posts after creating
//     fetchPosts();
//   };

//   const updatePost = async (id) => {
//     const updatedData = { title: 'Updated Title', content: 'Updated Content' };
    
//     await fetch(`/api/posts?id=${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updatedData),
//     });

//     // Refresh posts after updating
//     fetchPosts();
//   };

//   const deletePost = async (id) => {
//     await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });

//     // Refresh posts after deleting
//     fetchPosts();
//   };

//   return (
//     <div>
//       <h1>Posts</h1>
//       <button onClick={createPost}>Create Post</button>
//       <ul>
//         {posts.map(post => (
//           <li key={post._id}>
//             <h2>{post.title}</h2>
//             <p>{post.content}</p>
//             <button onClick={() => updatePost(post._id)}>Update</button>
//             <button onClick={() => deletePost(post._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PostsComponent;