"""add my story to stories

Revision ID: e96755d19f0c
Revises: a31bfe8eba6b
Create Date: 2020-07-09 21:58:00.273763

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e96755d19f0c"
down_revision = "a31bfe8eba6b"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("stories", sa.Column("my_story", sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("stories", "my_story")
    # ### end Alembic commands ###