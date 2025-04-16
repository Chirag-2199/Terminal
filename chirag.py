# chirag.py

def greet(name):
    return f"Hello, {name}!"

if __name__ == "__main__":
    import sys
    name = sys.argv[1]  # Get the name passed from the command line
    print(greet(name))  # Output the greeting message
