import { spawn } from 'child_process';
import path from 'path';

export default function handler(req: { method: string; body: { name: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: string; error?: string; }): void; new(): any; }; }; }) {
    if (req.method === 'POST') {
        const { name } = req.body;  // Extract name from the request body

        try {
            // Define the path to the chirag.py script
            const pythonPath = path.join(process.cwd(), 'chirag.py'); // Absolute path to your Python file

            // Spawn a Python process to run the chirag.py script
            const pythonProcess = spawn('python', [pythonPath, name]);

            let output = '';
            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();  // Capture the output from the Python script
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    res.status(200).json({ message: output });  // Return the Python script output
                } else {
                    res.status(500).json({ error: 'Python script execution failed' });
                }
            });
        } catch (error) {
            res.status(500).json({ error: (error instanceof Error) ? error.message : 'An unknown error occurred' });  // Handle any errors
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });  // Handle non-POST requests
    }
}
