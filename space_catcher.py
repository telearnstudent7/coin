import sys
import random
import pygame

# Initialize pygame
pygame.init()

# Window settings
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption("太空捕手")

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
YELLOW = (255, 255, 0)

# Settings
PLAYER_SIZE = 50
PLAYER_SPEED = 5
BILL_WIDTH = 100
BILL_HEIGHT = 50
COIN_SPEED = 4

# Load Images
try:
    _img_1000 = pygame.image.load("1000_ntd.png")
    BILL_IMG_1000 = pygame.transform.scale(_img_1000, (BILL_WIDTH, BILL_HEIGHT))
except:
    BILL_IMG_1000 = pygame.Surface((BILL_WIDTH, BILL_HEIGHT))
    BILL_IMG_1000.fill((0, 255, 0))

try:
    _img_2000 = pygame.image.load("2000_ntd.png")
    BILL_IMG_2000 = pygame.transform.scale(_img_2000, (BILL_WIDTH, BILL_HEIGHT))
except:
    BILL_IMG_2000 = pygame.Surface((BILL_WIDTH, BILL_HEIGHT))
    BILL_IMG_2000.fill((200, 200, 255)) # Light purple for 2000 fallback

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        # Create an image (surface) for the player
        self.image = pygame.Surface((PLAYER_SIZE, PLAYER_SIZE))
        self.image.fill(WHITE)
        
        # Get the rect and set initial position
        self.rect = self.image.get_rect()
        self.rect.centerx = WINDOW_WIDTH // 2
        self.rect.bottom = WINDOW_HEIGHT - 10

    def update(self):
        # Key handling within the sprint
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.rect.x -= PLAYER_SPEED
        if keys[pygame.K_RIGHT]:
            self.rect.x += PLAYER_SPEED

        # Boundary checks
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > WINDOW_WIDTH:
            self.rect.right = WINDOW_WIDTH

class Coin(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        
        # Determine bill type (20% chance for 2000 NTD)
        if random.random() < 0.2:
            self.image = BILL_IMG_2000
            self.score_value = 2000
        else:
            self.image = BILL_IMG_1000
            self.score_value = 1000
            
        # Get the rect and set initial random position
        self.rect = self.image.get_rect()
        self.rect.x = random.randint(0, WINDOW_WIDTH - BILL_WIDTH)
        self.rect.y = -BILL_HEIGHT # Start just above the screen

    def update(self):
        self.rect.y += COIN_SPEED
        # Note: We handle the "killing" and scoring logic in the main loop 
        # to simplify accessing the score variable.

def main():
    # Groups
    all_sprites = pygame.sprite.Group()
    coins = pygame.sprite.Group()

    # Create Player
    player = Player()
    all_sprites.add(player)

    # Score settings
    score = 0
    bonus_rain_triggered = False
    font = pygame.font.Font(None, 36)

    # Clock
    clock = pygame.time.Clock()
    
    running = True
    while running:
        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        # Spawn coins
        if random.randint(1, 60) == 1:
            coin = Coin()
            all_sprites.add(coin)
            coins.add(coin)

        # Bonus Money Rain: Drop 1000 bills when score reaches 100
        if score >= 100 and not bonus_rain_triggered:
            for _ in range(1000):
                coin = Coin()
                # Spread them out vertically above the screen so they rain down
                coin.rect.y = random.randint(-10000, -50)
                # Randomize x again to be sure (already done in init but consistent style)
                coin.rect.x = random.randint(0, WINDOW_WIDTH - BILL_WIDTH)
                all_sprites.add(coin)
                coins.add(coin)
            bonus_rain_triggered = True

        # Update all sprites
        all_sprites.update()

        # Check for missed coins (out of bounds)
        for coin in coins:
            if coin.rect.top > WINDOW_HEIGHT:
                score -= 5
                coin.kill()

        # Collision detection (Player vs Coins)
        # spritecollide returns a list of sprites from 'coins' that collided with 'player'
        # True means remove the coin sprite from all groups
        hits = pygame.sprite.spritecollide(player, coins, True)
        for hit in hits:
            score += hit.score_value
        
        # Drawing
        screen.fill(BLACK)
        all_sprites.draw(screen)

        # Draw Score
        score_text = font.render(f"Score: {score}", True, WHITE)
        screen.blit(score_text, (10, 10))

        # Update display
        pygame.display.flip()
        clock.tick(60)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()




