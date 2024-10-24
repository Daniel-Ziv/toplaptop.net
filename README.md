# Laptop Recommendation System - [LIVE SITE](https://toplaptop.net)
### [My Linkedin](https://www.linkedin.com/in/daniel-ziv/)

This project is a **Laptop Recommendation System** that helps users find the best laptop based on their specific needs and preferences, including tasks like **web browsing**, **gaming**, **photo editing**, **programming**, and more. The system uses weights for different laptop parameters (RAM, CPU, screen refresh rate, storage type, etc.) to calculate the best-suited laptops for users, considering factors such as **budget**, **portability**, and **screen size preferences**.

## Features

- **Dynamic Task-Based Weighting**: Users can select tasks like gaming, video editing, or programming, and the system dynamically adjusts weights to prioritize laptops based on these needs.
- **Price and Budget Filtering**: The system considers the user's budget to recommend laptops within their price range.
- **Real-Time Scoring**: Each laptop is scored based on how well it matches the user's selected criteria, and the top recommendations are displayed.
- **Responsive Design**: The recommendation system is fully responsive and works on all screen sizes.

## Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- **Fetch API** (for loading JSON data)
- **CircleProgress.js** (for rendering progress bars)
- **SVG icons** (for visual indicators)

## How It Works

The system works by taking user inputs on tasks they intend to use the laptop for, their budget, and preferences for screen size and portability. It then combines weights for each task and matches these with the laptop specifications available in the dataset. The scoring algorithm calculates the best match for the user's needs.

### Example Tasks:

- **Web Browsing**: Prioritizes laptops with lower RAM and CPU power.
- **Video Editing**: Requires higher CPU and RAM, and prioritizes SSD storage.
- **Gaming**: Focuses on high refresh rate screens, powerful CPUs, and gaming-specific features.
  
### Parameters Evaluated:

- **RAM Size & Type** (DDR3, DDR4, DDR5)
- **CPU Performance** (i3, i5, i7, i9, Ryzen, M1, M2, etc.)
- **Screen Refresh Rate**
- **Storage Type** (SSD or HDD)
- **Portability** (weight)
- **Price**


